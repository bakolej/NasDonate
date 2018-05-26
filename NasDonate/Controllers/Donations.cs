using Microsoft.AspNetCore.Mvc;

namespace NasDonate.Controllers
{
    public class Donations : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
