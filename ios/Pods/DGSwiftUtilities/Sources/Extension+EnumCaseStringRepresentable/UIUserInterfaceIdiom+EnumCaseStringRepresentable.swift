//
//  UIUserInterfaceIdiom+EnumCaseStringRepresentable.swift
//  
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit


extension UIUserInterfaceIdiom: EnumCaseStringRepresentable, CustomStringConvertible {

  public var caseString: String {
    switch self {
      case .unspecified:
        return "unspecified";

      case .phone:
        return "phone";

      case .pad:
        return "pad";

      case .tv:
        return "tv";

      case .carPlay:
        return "carPlay";

      case .mac:
        return "mac";
      
      #if !targetEnvironment(macCatalyst)
      #if swift(>=5.9)
      case .vision:
        return "vision";
      #endif
      #endif
      
      @unknown default:
        #if DEBUG
        print("Runtime Warning - Not implemented -", #file);
        #endif
        
        return "";
    };
  };
};
