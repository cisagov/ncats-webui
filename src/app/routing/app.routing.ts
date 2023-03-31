import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NavbarComponent } from "../navbar/navbar.component";
import { HomepageComponent } from "../homepage/homepage.component";
import { StatusComponent } from "../status/status.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { HiringDashboardComponent } from "../hiringdashboard/hiringdashboard.component";
import { HostMapComponent } from "../host-map/host-map.component";
import { HistoryComponent } from "../history/history.component";
import { ScanMapComponent } from "../scan-map/scan-map.component";
import { VulnerabilityMapComponent } from "../vulnerability-map/vulnerability-map.component";
import { FirstSeenVulnsComponent } from "../first-seen-vulns/first-seen-vulns.component";
import { PreferencesComponent } from "../preferences/preferences.component";
import { CybexComponent } from "../cybex/cybex.component";
import { BodComponent } from "../bod/bod.component";
import { FemaComponent } from "../fema/fema.component";
import { CongressionalComponent } from "../congressional/congressional.component";
import { StakeholdersComponent } from "../stakeholders/stakeholders.component";
import { WeeklyTicketsComponent } from "../weekly-tickets/weekly-tickets.component";
import { RiskRatingComponent } from "../risk-rating/risk-rating.component";
import { MetricsComponent } from "../metrics/metrics.component";
import { StatusDetailComponent } from "../status-detail/status-detail.component";

const appRoutes: Routes = [
  {
    path: "cybex/:chart",
    component: CybexComponent,
  },
  {
    path: "bod/:chart",
    component: BodComponent,
  },
  {
    path: "",
    component: NavbarComponent,
    children: [
      {
        path: "",
        component: HomepageComponent,
      },
      {
        path: "status/:acronym",
        component: StatusDetailComponent,
      },
      {
        path: "status",
        component: StatusComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "hiringdashboard",
        component: HiringDashboardComponent,
      },
      {
        path: "dashboard/firstseen",
        component: FirstSeenVulnsComponent,
      },
      {
        path: "maps/hosts",
        component: HostMapComponent,
      },
      {
        path: "maps/running",
        component: ScanMapComponent,
      },
      {
        path: "maps/active",
        component: VulnerabilityMapComponent,
      },
      {
        path: "history",
        component: HistoryComponent,
      },
      {
        path: "prefs",
        component: PreferencesComponent,
      },
      {
        path: "cybex",
        component: CybexComponent,
      },
      {
        path: "bod",
        component: BodComponent,
      },
      {
        path: "metrics",
        component: MetricsComponent,
      },
      {
        path: "metrics/fema",
        component: FemaComponent,
      },
      {
        path: "metrics/congressional",
        component: CongressionalComponent,
      },
      {
        path: "stakeholders",
        component: StakeholdersComponent,
      },
      {
        path: "metrics/weekly",
        component: WeeklyTicketsComponent,
      },
      {
        path: "metrics/risk",
        component: RiskRatingComponent,
      },
      {
        path: "**",
        redirectTo: "/",
        pathMatch: "full",
      },
    ],
  },
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
