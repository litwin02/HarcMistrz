namespace HarcMistrz_API.Models
{
	public class Meeting
	{
		public int Id { get; set; }
		public string? Name { get; set; }
		public string? Description { get; set; }
		public DateTime Date { get; set; }
		public string? Location { get; set; }
		public int TeamId { get; set; }

		public Team? Team { get; set; }
		public ICollection<AttendanceOnMeeting>? Attendances { get; set; }
	}
}
