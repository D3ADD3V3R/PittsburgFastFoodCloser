using CsvHelper.Configuration.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//validated,venue_name,venue_type,venue_address,website,events,etc,menu_url,menu_text,venue_notes,phone,email,homemade_pierogies,take_out,alcohol,lunch,handicap,publish,id,latitude,longitude
namespace PittsburgFastFoodCloser.Models
{
    public class Restaurant
    {
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool validated { get; set; }
        public string venue_name { get; set; }
        public string venue_type { get; set; }
        public string venue_address { get; set; }

        [Optional]
        public string website { get; set; }

        [Optional]
        public List<string> events { get; set; }

        [Optional]
        public string etc { get; set; }

        [Optional]
        public string menu_url { get; set; }

        [Optional]
        public string menu_text { get; set; }

        [Optional]
        public string venue_notes { get; set; }

        [Optional] 
        public string phone { get; set; }

        [Optional]
        public string email { get; set; }

        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool homemade_pierogies { get; set; }
        
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool take_out { get; set; }
        
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool alcohol { get; set; }
        
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool lunch { get; set; }
        
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool handicap { get; set; }
        
        [Optional]
        [BooleanTrueValues("True")]
        [BooleanFalseValues("False")]
        public bool publish { get; set; }
        
        [Optional]
        public int id { get; set; }
        
        public long latitude { get; set; }
        public long longitude { get; set; }

        public void String2Event(string eventlist)
        {
            this.events = eventlist.Split(",").ToList();
        }

    }
}
