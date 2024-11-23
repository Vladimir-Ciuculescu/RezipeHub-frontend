//
//  UIUserInterfaceSizeClass+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

extension UIUserInterfaceSizeClass: CaseIterable {
  public static var allCases: [Self] {
    [
      .unspecified,
      .compact,
      .regular,
    ]
  };
};
