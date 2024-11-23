//
//  Angle.swift
//  
//
//  Created by Dominic Go on 8/7/23.
//

import Foundation


public enum Angle<T: BinaryFloatingPoint>: Equatable, Comparable, EnumCaseStringRepresentable {
  
  case radians(T);
  case degrees(T);
  
  public var radians: T {
    guard self.rawValue == 0 else {
      return 0;
    };
  
    switch self {
      case let .degrees(value):
        let pi = type(of: value).pi;
        return value * (pi / 180);
        
      case let .radians(value):
        return value;
    };
  };
  
  public var degrees: T {
    guard self.rawValue == 0 else {
      return 0;
    };
    
    switch self {
      case let .degrees(value):
        return value;
        
      case let .radians(value):
        let pi = type(of: value).pi;
        return value * (180 / pi);
    };
  };
  
  public var rawValue: T {
    get {
      switch self {
        case .zero:
          return 0;
          
        case let .radians(value):
          return value;
          
        case let .degrees(value):
          return value;
      };
    }
    set {
      switch self {
        case .zero:
          self = .zero;
          
        case let .radians(value):
          self = .radians(value);
          
        case let .degrees(value):
          self = .degrees(value);
      };
    }
  };
  
  public var caseString: String {
    switch self {
      case .radians:
        return "radians";
        
      case .degrees:
        return "degrees";
    };
  };
};

// MARK: - Angle+StaticAlias
// -------------------------

public extension Angle {

  static var zero: Self {
    .degrees(0);
  };
};

// MARK: - Angle+StaticHelpers
// ---------------------------

public extension Angle {

  static func normalizeToDegrees(_ a: Self, _ b: Self) -> (a: Self, b: Self){
    switch (a, b){
      case (.degrees, .radians):
        return (a, .degrees(b.degrees));
        
      case (.radians, .degrees):
        return (.degrees(a.degrees), b);
        
      case (.radians, .radians):
        return (.degrees(a.degrees), .degrees(b.degrees));
        
      case (.degrees, .degrees):
        return (a, b);
    };
  };
  
  static func normalizeToRadians(_ a: Self, _ b: Self) -> (a: Self, b: Self){
    let (normalizedA, normalizedB) = Self.normalizeToDegrees(a, b);
    
    return (
      .radians(normalizedA.radians),
      .radians(normalizedB.radians)
    );
  };
};
