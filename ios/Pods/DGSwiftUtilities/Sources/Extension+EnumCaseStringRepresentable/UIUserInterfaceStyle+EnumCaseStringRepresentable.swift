//
//  UIUserInterfaceStyle+EnumCaseStringRepresentable.swift
//
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

extension UIUserInterfaceStyle: EnumCaseStringRepresentable, CustomStringConvertible {

  public var caseString: String {
    switch self {
      case .unspecified:
        return "unspecified";
        
      case .light:
        return "light";
        
      case .dark:
        return "dark";
        
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};
