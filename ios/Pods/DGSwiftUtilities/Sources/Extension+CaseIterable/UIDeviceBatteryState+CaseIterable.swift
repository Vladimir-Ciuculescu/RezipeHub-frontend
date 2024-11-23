//
//  UIDeviceBatteryState+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

extension UIDevice.BatteryState: CaseIterable {
  public static let allCases: [Self] = [
    .unknown,
    .unplugged,
    .charging,
    .full,
  ];
};

