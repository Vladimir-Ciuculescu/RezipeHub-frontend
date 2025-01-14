//
//  CACornerMask+InitializableFromString.swift
//  ReactNativeIosAdaptiveModal
//
//  Created by Dominic Go on 1/2/24.
//

import UIKit

extension CACornerMask: InitializableFromString {

  public init(fromString string: String) throws {
    switch string {
      case "layerMinXMinYCorner":
        self = .layerMinXMinYCorner;

      case "layerMaxXMinYCorner":
        self = .layerMaxXMinYCorner;

      case "layerMinXMaxYCorner":
        self = .layerMinXMaxYCorner;

      case "layerMaxXMaxYCorner":
        self = .layerMaxXMaxYCorner;

      case "allCorners":
        self = .allCorners;

      case "topCorners":
        self = .topCorners;

      case "bottomCorners":
        self = .bottomCorners;

      case "leftCorners":
        self = .leftCorners;

      case "rightCorners":
        self = .rightCorners;
        
      default:
        throw GenericError(
          errorCode: .invalidValue,
          description: "Invalid string value",
          extraDebugValues: [
            "string": string
          ]
        );
    };
  };
};
