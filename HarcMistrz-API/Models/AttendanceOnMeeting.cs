namespace HarcMistrz_API.Models
{
	public class AttendanceOnMeeting
	{
		public int Id { get; set; }
		public int MeetingId { get; set; }
		public int ScoutId { get; set; }
		public bool IsPresent { get; set; }


		public Meeting? Meeting { get; set; }
	}
}
