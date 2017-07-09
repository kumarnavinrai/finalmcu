import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { PhonePage } from '../phone/phone';
import { LaptopPage } from '../laptop/laptop';
import { WatermotorPage } from '../watermotor/watermotor';

import { SchedulePage } from '../schedule/schedule';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = LaptopPage;
  tab3Root: any = WatermotorPage;
  tab4Root: any = PhonePage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
