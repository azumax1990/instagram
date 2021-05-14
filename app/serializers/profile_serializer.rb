# == Schema Information
#
# Table name: profiles
#
#  id           :bigint           not null, primary key
#  introduction :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_profiles_on_user_id  (user_id)
#
class ProfileSerializer < ActiveModel::Serializer
  # include Rails.application.routes.url_helpers
  attributes :id, :avatar

  belongs_to :user
  has_one_attached :avatar

  # def avatar_url
  #   avatar.attached? ?  url_for(avatar) : nil
  # end

  def avatar_url
    avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_path(avatar, only_path: true) : nil
  end
end
