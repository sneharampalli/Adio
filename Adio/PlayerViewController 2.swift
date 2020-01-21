//
//  PlayerViewController.swift
//  Adio
//
//  Created by Romit Nagda on 1/20/20.
//  Copyright © 2020 Romit Nagda. All rights reserved.
//

import UIKit
import AVFoundation

protocol PlayerControl: class {
    func playSong(with uri: String)
    func pause()
}

protocol PlayerDelegate: class {
    func didUpdatePlayer(with player: SPTAppRemotePlayerState)
    func didConnect()
    func didDisconnect(with error: Error?)
    func didFailConnection(with error: Error?)
    func didFetch(_ image: UIImage, forTrackURI: String)
}

class PlayerViewController: UIViewController, AVAudioPlayerDelegate {
    
    @IBOutlet weak var trackLabel: UILabel!
    @IBOutlet weak var artistLabel: UILabel!
    @IBOutlet weak var albumLabel: UILabel!
    @IBOutlet weak var albumImageView: UIImageView!
    @IBOutlet weak var playlistLabel: UILabel!
    @IBOutlet weak var pauseButton: UIButton!
    
    var soundPlayer : AVAudioPlayer!
    var timerPlay:Timer!
    
    var isPaused = true
    weak var playerControl: PlayerControl? = nil

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let scene = UIApplication.shared.connectedScenes.first
        if let sd : SceneDelegate = (scene?.delegate as? SceneDelegate) {
            sd.viewControllerDelegate = self
            self.playerControl = sd
        }
        
        albumImageView.layer.cornerRadius = 10.0
        albumImageView.clipsToBounds = true
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }
    
    @IBAction func didTogglePause() {
        if isPaused {
            playerControl?.playSong(with: "20I6sIOMTCkB6w7ryavxtO")
        } else {
            playerControl?.pause()
        }
        updatePauseButton()
    }
    
    func updatePauseButton() {
        let systemName = isPaused ? "play.circle.fill" : "pause.circle.fill"
        pauseButton.setBackgroundImage(UIImage(systemName: systemName), for: UIControl.State())
    }
    
    func setupPlayer() {
        print("setup player")
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
}

extension PlayerViewController: PlayerDelegate {
    
    func didFetch(_ image: UIImage, forTrackURI: String) {
        albumImageView.image = image
    }
    
    func didDisconnect(with error: Error?) {
        print("disconnected")
    }
    
    func didFailConnection(with error: Error?) {
        print("failed connection")
    }
    
    func didConnect() {
        print("connected")
    }
    
    func didUpdatePlayer(with player: SPTAppRemotePlayerState) {
        print("DID UPDATE PLAYER")
        print(player.isPaused ? "⏸" : "▶️")
        print(player.contextTitle)
        print(player.playbackPosition)
        print(player.track.name)
        trackLabel.text = player.track.name
        playlistLabel.text = player.contextTitle
        artistLabel.text = player.track.artist.name
        albumLabel.text = player.track.album.name
        //albumImageView.image = player.track
        
        playerControl?.pause()
        print("paused")
        
        isPaused = player.isPaused
        updatePauseButton()
        
        self.setupPlayer()
        
        do {
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print(error)
        }
        print("play sound player")
        self.soundPlayer.play()
        print("did play")
        self.timerPlay = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: false) { timerPlay in
            // Stop playing the ads
            self.soundPlayer.stop()
            do {
                try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
                self.playerControl?.playSong(with: "20I6sIOMTCkB6w7ryavxtO")
            } catch {
                print(error)
            }
        }
        
    }
}

