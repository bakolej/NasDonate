using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NasDonate.Models;

namespace NasDonate.Controllers
{
    [Route("[controller]")]
    public class ProfileController : Controller
    {
        private readonly ApplicationDbContext _context;
        private IHostingEnvironment _appEnv;
        public ProfileController(ApplicationDbContext context, IHostingEnvironment appEnv)
        {
            _appEnv = appEnv;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Save(User user, IFormFile avatar)
        {
            FileModel avatarFile = null;

            if (avatar != null)
            {
                if (avatar.Length > 2097152) //2MB
                {
                    return BadRequest("Max size avatar - 2 MB");
                }

                string path = "/avatars/" + user.Wallet + Path.GetExtension(avatar.FileName); //Генерировать имя
                using (var fileStream = new FileStream(_appEnv.WebRootPath + path, FileMode.Create))
                {
                    await avatar.CopyToAsync(fileStream);
                }

                avatarFile = new FileModel {Name = avatar.FileName, Path = path};
                _context.Files.Add(avatarFile);
                _context.SaveChanges();
            }

            var dbUser = _context.Users.FirstOrDefault(u => u.Wallet == user.Wallet.Trim());
            if (dbUser != null)
            {
                dbUser.Wallet = user.Wallet;
                dbUser.Alias = user.Alias;
                dbUser.Avatar = avatarFile;

                _context.Update(dbUser);
            }
            else
            {
                dbUser = new User
                {
                    Wallet = user.Wallet,
                    Alias = user.Alias,
                    Avatar = avatarFile
                };
                _context.Add(dbUser);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("[action]/{wallet}")]
        public async Task<IActionResult> GetAvatarUrl(string wallet)
        {
            var user = _context.Users.Include(u => u.Avatar).FirstOrDefault(u => u.Wallet.Equals(wallet, StringComparison.OrdinalIgnoreCase));
            if(user == null) {
                return NotFound("avatar not found");
            }

            return Ok($"{user.Avatar.Path}");
        }

        [HttpGet("[action]/{alias}")]
        public async Task<IActionResult> GetWalletByAlias(string alias)
        {
            
            var user = _context.Users.FirstOrDefault(u => u.Alias.Equals(alias, StringComparison.OrdinalIgnoreCase));
            if(user == null) {
                return NotFound("alias not found");
            }

            return Ok($"{user.Wallet}");
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> IsAliasTaken(string alias, string wallet)
        {
            var user = _context.Users.FirstOrDefault(u => u.Alias.Equals(alias, StringComparison.OrdinalIgnoreCase));
            if (user == null || user.Wallet.Equals(wallet, StringComparison.OrdinalIgnoreCase))
            {
                return Ok(false);
            }

            return Ok(true);
        }
    }
}