class User < ActiveRecord::Base
  attr_accessible :gplus, :name
  
  validates :name, :presence => true
  validates :gplus, :uniqueness => true, :presence => true
end
