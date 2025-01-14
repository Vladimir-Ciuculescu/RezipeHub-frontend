//
//  UIUserInterfaceLevel+EnumCaseStringRepresentable.swift
//
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

@available(iOS 13.0, *)
extension UIUserInterfaceLevel: EnumCaseStringRepresentable, CustomStringConvertible {

  public var caseString: String {
    switch self {
      case .unspecified:
        return "unspecified";
        
      case .base:
        return "base";
        
      case .elevated:
        return "elevated";
        
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};
