using Microsoft.AspNetCore.Mvc;

namespace HarcMistrz_API.Controllers
{
	[ApiController]
	[Route("api/say-hello")]
	public class BasicController : ControllerBase
	{
		[HttpGet]
		public IActionResult SayHello()
		{
			return Ok("Hello, World!");
		}
	}
}
