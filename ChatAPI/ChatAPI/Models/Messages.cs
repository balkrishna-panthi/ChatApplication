using System.ComponentModel.DataAnnotations;

namespace ChatAPI.Models
{
    public class Messages
    {
        [Required]

        public string From { get; set; }
        public string To { get; set; }
        public string Content { get; set; }
    }
}
