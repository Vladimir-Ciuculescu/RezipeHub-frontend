//
//  UIInterfaceOrientation+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

extension UIInterfaceOrientation: CaseIterable {
  public static var allCases: [Self] = [
    .unknown,
    .portrait,
    .portraitUpsideDown,
    .landscapeLeft,
    .landscapeRight,
  ];
};

