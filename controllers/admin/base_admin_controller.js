module.exports = (pb) => {

  class BaseAdminController extends pb.BaseViewController {
      async init(ctx) {
          super.init(ctx);
          this.siteQueryService = new pb.SiteQueryService({site: this.site, onlyThisSite: true});
          this.settings = pb.SettingServiceFactory.getServiceBySite(this.site, true);

          this.vueModelService = this.createService('VueModelRegistrationService', 'kronos');
          this.AdminNavigationService = this.getServiceClass('AdminNavigationService', 'kronos');
          this.pluginService = new pb.PluginService(this.getServiceContext());
      }
      getAdminPills (navKey, localizationService, activePill, data) {
          let pills = pb.AdminSubnavService.get(navKey, localizationService, activePill, data);
          return pb.AdminSubnavService.addSiteToPills(pills, this.siteName);
      };
  }

  return BaseAdminController;
};
