using System.ComponentModel.DataAnnotations;

namespace ChatAPI.Models
{
    public class Users
    {
        [Required]
        [StringLength(50, MinimumLength = 3, ErrorMessage =" Must be at least {2} and maximum {1} characters")]
        public string Name { get; set; }
    }
}
