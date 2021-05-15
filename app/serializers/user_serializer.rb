# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  account                :string           default(""), not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :account, :avatar_url

  has_many :comments
  has_one :profile

  def avatar_url
    rails_blob_path(object.has_avatar) if object.has_avatar.attachment
  end
end
