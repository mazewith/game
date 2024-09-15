import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, Unsubscribe } from "firebase/database";
import DataService from "./DataService";
import { ControlSchema, PlayerSchema } from "@/interfaces";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Firebase service class. Connects to Firebase Realtime Database.
 * @extends DataService
 */
export default class FirebaseService extends DataService {
  private playersRef;
  private progressRef;
  private connectListener?: Unsubscribe;
  private controlListener?: Unsubscribe;

  constructor(roomId: string) {
    super();
    this.playersRef = ref(database, `${roomId}/players`);
    this.progressRef = ref(database, `${roomId}/controls`);
  }

  // Connect listeners to Firebase Realtime Database
  connect(): void {
    console.log("Connecting to Firebase");
    this.connectListener = onValue(this.playersRef, (snapshot) => {
      const data: PlayerSchema = snapshot.val();
      if (data) {
        this.emit(this.addPlayerEvent, data);
      }
    });

    this.controlListener = onValue(this.progressRef, (snapshot) => {
      const data: ControlSchema = snapshot.val();
      if (data) {
        this.emit(this.playerMoveEvent, data);
      }
    });
  }

  // Disconnect from the Firebase listeners
  disconnect(): void {
    if (this.connectListener) {
      this.connectListener();
      this.connectListener = undefined;
    }
    if (this.controlListener) {
      this.controlListener();
      this.controlListener = undefined;
    }
  }
}
