using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using NasDonate.Models;

namespace NasDonate.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Route("")]
        [Route("to/{nickname}")]
        public IActionResult Index(string nickname)
        {
            var user = _context.Users.FirstOrDefault(u => u.Alias.Equals(nickname, StringComparison.OrdinalIgnoreCase));
            ViewBag.To = user?.Wallet ?? nickname; 
            return View();
        }

        [Route("faq")]
        public IActionResult Faq()
        {
            return View();
        }
    }
}
