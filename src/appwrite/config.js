import { Client, Databases, ID, Storage, Query} from "appwrite";
import { APPWRITE_BUCKET_ID, APPWRITE_COLLECTION_ID, APPWRITE_DB_ID, APPWRITE_ID, APPWRITE_URL } from "../envConf/conf";

class AppwriteService{
    client = new Client;
    database;
    bucket;

    constructor (){
        this.client
            .setProject(APPWRITE_ID)
            .setEndpoint(APPWRITE_URL)
        this.database = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    // methods for appwrite service

    //createPost
    async createPost({slug, title, content, isPublic, imageFile, userID, userName}){
        try {
            const postImageData = await this.uploadImage(imageFile)
            try {
                if(postImageData){
                    const postImage = postImageData.$id
                    return await this.database.createDocument(
                        APPWRITE_DB_ID,
                        APPWRITE_COLLECTION_ID,
                        slug,
                        {
                            title, 
                            content, 
                            isPublic, 
                            postImage, 
                            userID, 
                            userName
                        }
                )
                }
            } catch (error) {
                await this.deleteImage(postImageData.$id)
                console.log("Error : Errow while creating post :: ", error)
                return error.message
            }
        } catch (error) {
            console.log("Error : Error while uploading image :: ", error)
        }
    }

    //updatePost
    async updatePost(slug, imageFile, {title, content, isPublic, postImage}){

        if(imageFile){
            await this.deleteImage(postImage)
            postImage = await this.uploadImage(imageFile)
        }
        try {
            return await this.database.updateDocument(
                APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                slug,
                {
                    title, 
                    content, 
                    isPublic, 
                    postImage: postImage.$id, 
                }
            )
        } catch (error) {
            console.log("Error : Error while updating post :: ", error)
        }
        
    }

    //delete posts
    async deletePost(id){
        try {
            return await this.database.deleteDocument(
                APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                id
            )
        } catch (error) {
            console.log("Error : Error while deleting post :: ", error)
        }
    }

    //get posts

    async getPosts(userID){
        try {
            return await this.database.listDocuments(APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                userID && [
                    Query.equal('userID', userID)
                ]
            )
        } catch (error) {
            console.log("Error : Error while getting post :: ", error)
        }
    }


    //upload image
    async uploadImage(file){
        try {
            return await this.bucket.createFile(
                APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Error : Error while uploading file :: ", error)
        }
    }

    //delete image
    async deleteImage(fileID){
        try {
            return await this.bucket.deleteFile(
                APPWRITE_BUCKET_ID,
                fileID
            )
        } catch (error) {
            console.log("Error : Error while deleting file :: ", error)
        }
    }

    //get image
    getPreviewImage(fileID){
        try {
            return this.bucket.getFileView(
                APPWRITE_BUCKET_ID,
                fileID
            )
        } catch (error) {
            console.log("Error : Error while getting file :: ", error)
        }
    }

    //get preview image
    async getImage(fileID){
        try {
            return await this.bucket.getFilePreview(
                APPWRITE_BUCKET_ID,
                fileID
            )
        } catch (error) {
            console.log("Error : Error while getting preview file :: ", error)
        }
    }
}

const appwriteService = new AppwriteService()

export default appwriteService;