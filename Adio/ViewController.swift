//
//  ViewController.swift
//  Adio
//
//  Created by Sneha Rampalli on 10/15/19.
//  Copyright © 2019 Sneha Rampalli. All rights reserved.
//

import UIKit
import AVFoundation
//import AVAudioSession

class ViewController: UIViewController, AVAudioPlayerDelegate {
    
//    let SpotifyClientID = Constants.apiKey
//    let SpotifyRedirectURL = URL(string: "adio://adio-login-playback")!
//
//    lazy var configuration = SPTConfiguration(
//      clientID: SpotifyClientID,
//      redirectURL: SpotifyRedirectURL
//    )
//
//    lazy var appRemote: SPTAppRemote = {
//      let appRemote = SPTAppRemote(configuration: self.configuration, logLevel: .debug)
//      appRemote.connectionParameters.accessToken = self.accessToken
//      appRemote.delegate = self
//      return appRemote
//    }()
    
//    lazy var playURI = ""
//
//    func connect() {
//      self.appRemote.authorizeAndPlayURI(self.playURI)
//    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
        
    @IBOutlet weak var playBTN: UIButton!
    var soundPlayer : AVAudioPlayer!
    
    @IBOutlet weak var playButtonImage: UIImageView!
    
    func setupPlayer() {
        let audioFilename = Bundle.main.path(forResource: "BeautifulNow", ofType: "m4a")
        do {
            soundPlayer = try AVAudioPlayer(contentsOf: URL(fileURLWithPath: audioFilename!))
            soundPlayer.delegate = self
            soundPlayer.prepareToPlay()
            soundPlayer.volume = 1.0
        } catch {
            print(error)
        }
    }
    
    @IBAction func pauseAudio(_ sender: UIButton) {
        if playBTN.titleLabel?.text == "start" {
            setupPlayer()
            do {
                try AVAudioSession.sharedInstance().setActive(true)
            } catch {
                print(error)
            }
            playBTN.setTitle("stop", for: .normal)
            soundPlayer.play()
            playButtonImage.isHighlighted = true
        } else {
            soundPlayer.stop()
            do {
                try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
            } catch {
                print(error)
            }
            playBTN.setTitle("start", for: .normal)
            playButtonImage.isHighlighted = false
        }
    }
}

