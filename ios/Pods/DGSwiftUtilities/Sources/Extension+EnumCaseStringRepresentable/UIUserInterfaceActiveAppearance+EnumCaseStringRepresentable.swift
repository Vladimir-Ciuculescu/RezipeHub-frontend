//
//  UIUserInterfaceActiveAppearance+EnumCaseStringRepresentable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

@available(iOS 14.0, *)
extension UIUserInterfaceActiveAppearance: EnumCaseStringRepresentable, CustomStringConvertible {

  public var caseString: String {
    switch self {
      case .unspecified:
        return "unspecified";
        
      case .inactive:
        return "inactive";
        
      case .active:
        return "active";
        
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};

