using CsvHelper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PittsburgFastFoodCloser.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PittsburgFastFoodCloser.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IWebHostEnvironment Environment;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment _environment)
        {
            _logger = logger;
            Environment = _environment;
        }

        public IActionResult Index()
        {
            TextReader textReader = new StreamReader(Path.Combine(this.Environment.WebRootPath, "Ressources" + Path.DirectorySeparatorChar + "2019_pittsburgh_fish_fry_locations.csv"));
            CsvReader csvReader = new CsvReader(textReader, System.Globalization.CultureInfo.InvariantCulture);

            //var records = csvReader.GetRecords<Restaurant>().ToList();
            var restaurantRecords = csvReader.GetRecords<dynamic>().ToList();
            ViewResult result = View();



            return result;
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
