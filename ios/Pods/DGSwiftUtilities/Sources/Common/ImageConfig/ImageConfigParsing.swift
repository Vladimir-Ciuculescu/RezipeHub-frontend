//
//  ImageConfigParsing.swift
//  
//
//  Created by Dominic Go on 7/29/24.
//

import UIKit


public protocol ImageConfigParsing: InitializableFromDictionary, AnyObject {
  
  typealias ImageConfigEntry = (ImageConfig & InitializableFromDictionary).Type;
  typealias ImageConfigMap = [String: ImageConfigEntry];
  
  static var configTypeItems: [ImageConfigEntry] { get set };
  
  static var configTypeMapCache: ImageConfigMap { get set };
  
  var imageConfig: any ImageConfig { get set };
  
  init(imageConfig: any ImageConfig);
};

// MARK: - ImageConfigParsing+PrivateHelpers
// -----------------------------------------

fileprivate extension ImageConfigParsing {
  
  static var didSetConfigTypeMapCache: Bool {
    Self.configTypeItems.count == Self.configTypeMapCache.count;
  };
  
  static func setConfigTypeMapCache(){
    Self.configTypeMapCache = Self.configTypeItems.reduce(into: [:]) {
      $0[$1.imageType] = $1;
    };
  };
};

// MARK: - ImageConfigParsing+PublicHelpers
// -----------------------------------------

public extension ImageConfigParsing {
  
  static var configTypeMap: ImageConfigMap {
    if !Self.didSetConfigTypeMapCache {
      Self.setConfigTypeMapCache();
    };
    
    return Self.configTypeMapCache;
  };
  
  var imageType: String {
    type(of: self.imageConfig).imageType;
  };
  
  var isImageLoading: Bool {
    self.imageConfig.isImageLoaded;
  };
  
  var cachedImage: UIImage? {
    self.imageConfig.cachedImage;
  };
  
  func makeImage() throws -> UIImage {
    return try self.imageConfig.makeImage();
  };
  
  func preloadImageIfNeeded(completion: ((_ sender: Self) -> Void)? = nil) {
    guard !self.imageConfig.isImageLoaded else { return };
    
    self.imageConfig.isImageLoading = true;
    
    DispatchQueue.global(qos: .background).async {
      let image = try? self.imageConfig.makeImage();
      self.imageConfig.cachedImage = image;
      self.imageConfig.isImageLoading = false;
      
      guard let completion = completion else { return };
      DispatchQueue.main.async {
        completion(self);
      }
    };
  };
};

// MARK: - ImageConfigParsing+InitializableFromDictionary
// ------------------------------------------------------

public extension ImageConfigParsing {

  init(fromDict dict: Dictionary<String, Any>) throws {
    let imageType: String = try dict.getValueFromDictionary(forKey: "imageType");
    
    let imageConfigType = Self.configTypeMap[imageType];
    guard let imageConfigType = imageConfigType else {
      throw GenericError(
        errorCode: .unexpectedNilValue
      );
    };
    
    let imageConfig = try imageConfigType.init(fromDict: dict);
    self.init(imageConfig: imageConfig);
  };
};
