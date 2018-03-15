import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, ActionSheetController,ModalController } from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {Comment} from '../../shared/comment';
import {FavoriteProvider} from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private toastCtrl:ToastController, 
     public ModalCtrl:ModalController,
     public actionsheetCtrl:ActionSheetController,
     private socialSharing:SocialSharing,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice:FavoriteProvider) {
    this.dish = navParams.get('dish');
    this.favorite=this.favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }
  addToFavorites(){
    console.log('Adding to Favorites', this.dish.id);
    this.favorite=this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message:'Dish'+this.dish.id+ 'added as a favorite successfully',
      position:'middle',
      duration:3000
    }).present();
  }
  presentActionSheet(){
    let actionSheet=this.actionsheetCtrl.create({
      title:'dish options',
      cssClass:'action-sheets',
      buttons:[
        {
        text:'Add to Favorites',
        handler:()=>{
          this.addToFavorites();
        }
      },
        {
        text:'Add Comment',
        handler:()=>{
          this.openComment();
        }
      },
      {
        text:'Share via Facebook',
        handler:()=>{
          this.socialSharing.shareViaFacebook(
            this.dish.name+ '---'+ this.dish.description,
            this.BaseURL+this.dish.image, ''
          )
          .then(()=>console.log('Posted successfully to Facebook') )
          .catch(()=>console.log('Failed to post to Facebook') );
        }
      },
      {
        text:'Share via Twitter',
        handler:()=>{
          this.socialSharing.shareViaTwitter(
            this.dish.name+ '---'+ this.dish.description,
            this.BaseURL+this.dish.image, ''
          )
          .then(()=>console.log('Posted successfully to Facebook') )
          .catch(()=>console.log('Failed to post to Facebook') );
        }
      },
        {
        text:'Cancel',
        role:'cancel',
        handler:()=>{
          console.log('cancel');
        }
      }
    ]
    });
    actionSheet.present();
  }
openComment(){
  let modal=this.ModalCtrl.create(CommentPage);
  modal.onDidDismiss(data=>{
    if(data){
      this.dish.comments.push(data);
    }
    
  })
  modal.present();
}
}
