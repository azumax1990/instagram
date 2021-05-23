# == Schema Information
#
# Table name: posts
#
#  id         :bigint           not null, primary key
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_posts_on_user_id  (user_id)
#
class Post < ApplicationRecord
  validate :image_type, :image_size, :image_length

  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :comments, dependent: :destroy
  has_many_attached :images

  belongs_to :user

  def created_time
    I18n.l(self.created_at, format: :default)
  end

  scope :within_a_week, -> { where(created_at: Time.current.ago(7.days)..Time.current) }
  scope :popular_likes, -> { joins(:likes).group('likes.post_id').order('count_all DESC').count }
  
  private
  def image_type
    images.each do |image|
      if !image.blob.content_type.in?(%('image/jpeg image/png'))
        image.purge
        image.add(:image, 'はjpegまたはpng形式でアップロードしてください')
      end
    end
  end

  def image_size
    images.each do |image|
      if image.blob.byte_size > 5.megabytes
        image.purge
        errors.add(:image, "は1つのファイル5MB以内にしてください")
      end
    end
  end

  def image_length
    if images.length == 0
      images.purge
      errors.add(:image, "を添付してください")
    end
  end
end