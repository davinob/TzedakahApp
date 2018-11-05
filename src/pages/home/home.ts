import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  chosenCountry:any;
  amountSaved:number=0;




  constructor(public navCtrl: NavController,private storage: Storage,public alertCtrl: AlertController,
    private iab: InAppBrowser) {
    this.chosenCountry={name:"israel", moneySign:"₪",matbeot:[0.1,0.5,2,5,10,20,50,100,200]};
  }


  public openWithInAppBrowser(url : string){
    let target = "_blank";
    this.iab.create(url,target);
}

  ngOnInit(): void {  
  this.initFromStorage();
    
  }

  async initFromStorage()
  {
    this.amountSaved=await  this.storage.get('amountSaved');
    if (!this.amountSaved)
      this.amountSaved=0;

    this.chosenCountry=await  this.storage.get('chosenCountry');
      if (!this.chosenCountry)
        this.chosenCountry={name:"israel", moneySign:"₪",matbeot:[0.1,0.5,1,2,5,10,20,50,100,200]};
  }

  countries=
  [
    {name:"us", moneySign:"$",  matbeot:[0.01,0.05,0.1,0.25,1,2,5,10,20,50,100]},
    {name:"eu", moneySign:"€",  matbeot:[0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,20,50,100,200,500]},
    {name:"israel", moneySign:"₪",  matbeot:[0.1,0.5,1,2,5,10,20,50,100,200]}
  ];

  chooseCountry(country:string)
  {
    this.chosenCountry=country;
    this.storage.set('chosenCountry', this.chosenCountry);
  }

  


  addAmount(amount:number):void
  {
    this.amountSaved+=amount;
    this.amountSaved=(Math.round(this.amountSaved*100))/100;
    this.storage.set('amountSaved',this.amountSaved);
  }

  async refreshAmount()
  {
    if (await this.presentConfirm("Are you sure you want to reset the amount?"))
   { this.amountSaved=0;
    this.storage.set('amountSaved',this.amountSaved);
    }
  }


  presentConfirm(message:any):Promise<any> {

    return new Promise<any>((resolve, reject) => {
      let alert = this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              resolve(false);
            }
          },
          {
            text: 'OK',
            handler: () => {
             resolve(true);
            }
          }
        ]
      });
      alert.present();
 
      
  });
  }

}
