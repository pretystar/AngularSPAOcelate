namespace AngularSPAWebAPI.Models.AccountViewModels
{
    /// <summary>
    /// Class required to create a new user.
    /// </summary>
    public class UpdateViewModel: CreateViewModel
    {
        public bool EmailConfirmed { get; set; }
        public bool LockoutEnabled {get;set;}
    }
}
