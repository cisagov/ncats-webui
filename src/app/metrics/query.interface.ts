export interface Query {
  start: Date;
  end: Date;

  vuln_ticket_count?: string;
  top_vulns?: string;

  top_OS?: boolean;
  top_vuln_services?: boolean;
  top_services?: boolean;
  num_orgs_scanned?: boolean;
  num_addresses_hosts_scanned?: boolean;
  num_reports_generated?: boolean;
  avg_cvss_score?: boolean;
  unique_vulns?: boolean;
  new_vuln_detections?: boolean;
}
