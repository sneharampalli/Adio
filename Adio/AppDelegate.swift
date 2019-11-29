//
//  AppDelegate.swift
//  Adio
//
//  Created by Sneha Rampalli on 10/15/19.
//  Copyright © 2019 Sneha Rampalli. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
//, SPTAppRemoteDelegate, SPTAppRemotePlayerStateDelegate {

//    func appRemoteDidEstablishConnection(_ appRemote: SPTAppRemote) {
//      // Connection was successful, you can begin issuing commands
//      print("connected")
//      self.appRemote.playerAPI?.delegate = self
//      self.appRemote.playerAPI?.subscribe(toPlayerState: { (result, error) in
//        if let error = error {
//          debugPrint(error.localizedDescription)
//        }
//      })
//    }
//
//    func appRemote(_ appRemote: SPTAppRemote, didDisconnectWithError error: Error?) {
//      print("disconnected")
//    }
//    func appRemote(_ appRemote: SPTAppRemote, didFailConnectionAttemptWithError error: Error?) {
//      print("failed")
//    }
//    func playerStateDidChange(_ playerState: SPTAppRemotePlayerState) {
//      debugPrint("Track name: %@", playerState.track.name)
//      print("player state changed")
//    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
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
    
//    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
//      let parameters = appRemote.authorizationParameters(from: url);
//
//            if let access_token = parameters?[SPTAppRemoteAccessTokenKey] {
//                appRemote.connectionParameters.accessToken = access_token
//                self.accessToken = access_token
//            } else if let error_description = parameters?[SPTAppRemoteErrorDescriptionKey] {
//                // Show the error
//            }
//      return true
//    }
//
//    func applicationWillResignActive(_ application: UIApplication) {
//      if self.appRemote.isConnected {
//        self.appRemote.disconnect()
//      }
//    }
//
//    func applicationDidBecomeActive(_ application: UIApplication) {
//      if let _ = self.appRemote.connectionParameters.accessToken {
//        self.appRemote.connect()
//      }
//    }

}

