namespace HarcMistrz_API.Models
{
	public class Parent : User
	{
		public int ScoutId { get; set; }

		public User? Scout { get; set; }
	}
}
