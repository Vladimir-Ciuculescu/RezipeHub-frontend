//
//  UIModalPresentationStyle+CustomStringConvertible.swift
//
//
//  Created by Dominic Go on 6/17/24.
//

import UIKit


extension UIModalPresentationStyle: EnumCaseStringRepresentable {

  public var caseString: String {
    switch self {
      case .fullScreen:
        return "fullScreen";
        
      case .pageSheet:
        return "pageSheet";
        
      case .formSheet:
        return "formSheet";
        
      case .currentContext:
        return "currentContext";
        
      case .custom:
        return "custom";
        
      case .overFullScreen:
        return "overFullScreen";
        
      case .overCurrentContext:
        return "overCurrentContext";
        
      case .popover:
        return "popover";
        
      case .none:
        return "none";
        
      case .automatic:
        return "automatic";
        
      @unknown default:
        return "unknown";
    };
  };
};
