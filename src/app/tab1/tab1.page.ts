import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonIcon, IonToast } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Firestore, addDoc, collection, collectionData, orderBy, query, serverTimestamp} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgFor, NgIf, AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Settings } from '../tab2/settings';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss'],
	standalone: true,
	imports: [IonToast, IonIcon, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, CommonModule, FormsModule, IonButton, IonInput, IonFooter, AsyncPipe, NgFor, NgIf, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page implements OnInit{
	firestore: Firestore = inject(Firestore);
	items$: Observable<any[]>;
	newMessage: string = '';
	settings: Settings = {} as Settings;
	query;
	@ViewChild('ChatContainer') private chatContainer: any;


	databaseName :string = 'room_1';

	constructor() {
		const aCollection = collection(this.firestore, this.databaseName);
		this.query = query(aCollection, orderBy('timestamp', 'asc'));
		this.items$ = collectionData(this.query);
	}

	async sendNewMessage(event: Event) {
		event.preventDefault();
		const aCollection = collection(this.firestore, this.databaseName);
		let timestamp = serverTimestamp();
		if(this.settings.name !== ''){
			await addDoc(aCollection, {
				author: this.settings.name,
				text: this.newMessage,
				timestamp: timestamp
			}).then(() => {
				this.scrollToBottomOnInit();
			});
		}
		return;
	}

	ngOnInit() {
		const storedSettings = localStorage.getItem('settings');
		if(storedSettings) {
			this.settings = JSON.parse(storedSettings);
		}
		this.scrollToBottomOnInit();    
		//window.scrollTo(0, document.body.scrollHeight);

	}

	ionViewWillEnter(){
		this.scrollToBottom();
		//window.scrollTo(0, document.body.scrollHeight);
	}
	scrollToBottom() {
		this.chatContainer.scrollToBottom(0);
		//window.scrollTo(0, document.body.scrollHeight);
	}
	
	scrollToBottomOnInit() {
		setTimeout(() => {
			if (this.chatContainer.scrollToBottom) {
				this.scrollToBottom();
				//console.log("?");
			}
		}, 1000);
		//window.scrollTo(0, document.body.scrollHeight);
	}
	  
	getLocalStorageName(): string {
		const storedSettings = localStorage.getItem('settings');
		if(storedSettings) {
			this.settings = JSON.parse(storedSettings);
			return this.settings.name;
		}
		return "";
	}
	
	getDate(possibleDate: any): string {
		if(possibleDate === undefined) {
			return "ERROR";
		}
		if(possibleDate === null) {
			return "ERROR";
		}
		if (typeof possibleDate.toDate === 'function') {
			const today = new Date();
			const messageDate = possibleDate.toDate();
			if (messageDate.toDateString() === today.toDateString()) {
				return messageDate.toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' });
			} else {
				return messageDate.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
			}
		} else {
			return "ERROR";
		}
	}
}
