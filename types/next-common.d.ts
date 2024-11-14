// SubMenuItem.ts
export interface SubMenuItem {
  title: string;
  path: string;
}

// SideNavItem.ts
import { ReactElement } from "react";
import { SubMenuItem } from "./SubMenuItem";

export interface SideNavItem {
  title: string;
  path: string;
  icon: ReactElement;
  submenu?: boolean;
  subMenuItems?: SubMenuItem[];
}
