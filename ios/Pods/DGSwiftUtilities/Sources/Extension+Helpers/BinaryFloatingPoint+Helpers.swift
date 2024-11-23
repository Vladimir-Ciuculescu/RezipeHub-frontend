//
//  File 2.swift
//  
//
//  Created by Dominic Go on 7/10/24.
//

import Foundation


public extension BinaryFloatingPoint {
  
  var asWholeNumberExact: Int? {
    Int(exactly: self)
  };

  var isWholeNumber: Bool {
    self.asWholeNumberExact != nil;
  };
};
