class UserSerializer < ActiveModel::Serializer
  attributes :id, :account

  has_many :comments
  has_one :profile
end
