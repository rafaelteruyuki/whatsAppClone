import { User } from "../../interfaces/user.interface";

export interface LocalUserImage extends User {
  imageBlob: Blob | null;
}