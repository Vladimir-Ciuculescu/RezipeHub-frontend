//
//  UIInterfaceOrientation+EnumCaseStringRepresentable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

extension UIInterfaceOrientation: EnumCaseStringRepresentable {
  public var caseString: String {
    switch self {
      case .unknown:
        return "unknown";
        
      case .portrait:
        return "portrait";
        
      case .portraitUpsideDown:
        return "portraitUpsideDown";
        
      case .landscapeLeft:
        return "landscapeLeft";
        
      case .landscapeRight:
        return "landscapeRight";
        
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};
