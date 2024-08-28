using ChatAPI.Models;
using ChatAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService chatService;
        public ChatController(ChatService chatService)
        {
            this.chatService =  chatService;     
        }

        [HttpPost("register-user")]
        public IActionResult RegisterUser(Users user)
        {
            if (chatService.AddUserToList(user.Name))
            {
                return NoContent() ; //status 204
            }
            return BadRequest("This name is already taken please choose another name");

        }
    }
    
}
