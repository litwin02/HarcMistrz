namespace HarcMistrz_API.Models
{
	public class Payments
	{
		public int Id { get; set; }
		public int ScoutId { get; set; }
		public string? Title { get; set; }
		public double Amount { get; set; }
		public string? Status { get; set; }
		public DateTime Date { get; set; }


		public User? Scout { get; set; }
	}
}
