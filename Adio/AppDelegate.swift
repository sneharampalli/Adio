//
//  AppDelegate.swift
//  Adio
//
//  Created by Romit Nagda on 1/20/20.
//  Copyright © 2020 Romit Nagda. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    class var sharedInstance: AppDelegate {
        get {
            return UIApplication.shared.delegate as! AppDelegate
        }
    }
    

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        return true
    }

    // MARK: UISceneSession Lifecycle


    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }
    
    /*
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        let parameters = appRemote.authorizationParameters(from: url)
        
        if let access_token = parameters?[SPTAppRemoteAccessTokenKey] {
            appRemote.connectionParameters.accessToken = access_token
            self.accessToken = access_token
            print("Success! The access token is \(access_token)")
        } else if let error_description = parameters?[SPTAppRemoteErrorDescriptionKey] {
            dump(error_description)
        }
        return true
    }*/
    
    /*func playSong() {
        SPTAppRemote.checkIfSpotifyAppIsActive { (isActive) in
            print("Spotify is active: \(isActive)")
            self.appRemote = SPTAppRemote(configuration: AppDelegate().configuration, logLevel: .debug)
            let spotifyInstalled = self.appRemote.authorizeAndPlayURI("spotify:track:69bp2EbF7Q2rqc5N3ylezZ")
            if !(spotifyInstalled ?? false) {
                fatalError()
            } else {
                print("Spotify is installed! Woo.")
            }
        }
    }*/
}
