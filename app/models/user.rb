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
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :account, uniqueness: true

  has_many :following_relationships, foreign_key: 'follower_id', class_name: 'Relationship', dependent: :destroy
  has_many :followings, through: :following_relationships, source: :following

  has_many :follower_relationships, foreign_key: 'following_id', class_name: 'Relationship', dependent: :destroy
  has_many :followers, through: :follower_relationships, source: :follower

  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_one :profile, dependent: :destroy

  def prepare_profile
    profile || build_profile
  end

  def has_liked?(post)
    likes.exists?(post_id: post.id)
  end

  def has_avatar
    if profile&.avatar&.attached?
      profile.avatar
    else
      'user-icon.png'
    end
  end

  def follow(user)
    following_relationships.create(following_id: user.id)
  end

  def unfollow(user)
    relation = following_relationships.find_by(following_id: user.id)
    relation.destroy
  end

  def has_followed?(user)
    following_relationships.exists?(following_id: user.id)
  end
end
