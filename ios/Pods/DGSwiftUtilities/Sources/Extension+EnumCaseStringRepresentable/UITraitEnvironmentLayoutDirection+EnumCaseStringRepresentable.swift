//
//  UITraitEnvironmentLayoutDirection+EnumCaseStringRepresentable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

extension UITraitEnvironmentLayoutDirection: EnumCaseStringRepresentable, CustomStringConvertible {

  public var caseString: String {
    switch self {
      case .unspecified:
        return "unspecified";
        
      case .leftToRight:
        return "leftToRight";
        
      case .rightToLeft:
        return "rightToLeft";
        
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};
