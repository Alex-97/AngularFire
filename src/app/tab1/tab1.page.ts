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

	async sendNewMessage() {
		const aCollection = collection(this.firestore, this.databaseName);
		let timestamp = serverTimestamp();
		if(this.settings.name !== ''){
			await addDoc(aCollection, {
				author: this.settings.name,
				text: this.newMessage,
				timestamp: timestamp
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
	}

	ionViewWillEnter(){
		this.scrollToBottom();
	}
	scrollToBottom() {
		this.chatContainer.scrollToBottom(300);
	}
	
	scrollToBottomOnInit() {
		setTimeout(() => {
			if (this.chatContainer.scrollToBottom) {
				this.scrollToBottom();
			}
		}, 500);
	}
	  
	getLocalStorageName(): string {
		const storedSettings = localStorage.getItem('settings');
		if(storedSettings) {
			this.settings = JSON.parse(storedSettings);
			return this.settings.name;
		}
		return "";
	}
	
	getDate(arg0: any): string {
		if (typeof arg0.toDate === 'function') {
			return arg0.toDate().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
		} else {
			return "ERROR";
		}
	}
}
