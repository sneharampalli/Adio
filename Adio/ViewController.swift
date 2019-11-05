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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
        
    @IBOutlet weak var playBTN: UIButton!
    var soundPlayer : AVAudioPlayer!
    
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
        if playBTN.titleLabel?.text == "Play" {
            setupPlayer()
            do {
                try AVAudioSession.sharedInstance().setActive(true)
            } catch {
                print(error)
            }
            playBTN.setTitle("Stop", for: .normal)
            soundPlayer.play()
        } else {
            soundPlayer.stop()
            do {
                try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
            } catch {
                print(error)
            }
            playBTN.setTitle("Play", for: .normal)
        }
    }
}

