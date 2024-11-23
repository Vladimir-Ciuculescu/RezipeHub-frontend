//
//  CAAnimationBlockDelegate.swift
//  
//
//  Created by Dominic Go on 10/24/23.
//

import UIKit


public class CAAnimationBlockDelegate: NSObject, CAAnimationDelegate {

  public typealias StartBlock = (CAAnimation) -> ();
  public typealias EndBlock = (CAAnimation, Bool) -> ();

  var onStartBlock: StartBlock?
  var onEndBlock: EndBlock?

  public func animationDidStart(_ anim: CAAnimation) {
    self.onStartBlock?(anim);
  };

  public func animationDidStop(_ anim: CAAnimation, finished flag: Bool) {
    self.onEndBlock?(anim, flag);
  };
};
