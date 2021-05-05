class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :avatar

  belongs_to :user
end
