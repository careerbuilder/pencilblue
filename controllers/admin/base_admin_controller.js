
module.exports = function BaseAdminControllerModule(pb) {
    /******
     * @deprecated we can combine this functionality into other controllers
     * @param pb
     * @returns {BaseAdminController}
     */
    class BaseAdminController extends pb.BaseController {
        promisedInit () {
            this.siteQueryService = new pb.SiteQueryService({site: this.site, onlyThisSite: true});
            this.settings = pb.SettingServiceFactory.getServiceBySite(this.site, true);
        }
        getAdminPills (navKey, localizationService, activePill, data) {
            let pills = pb.AdminSubnavService.get(navKey, localizationService, activePill, data);
            return pb.AdminSubnavService.addSiteToPills(pills, this.siteName);
        }
    }


  return BaseAdminController;
};
