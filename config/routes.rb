Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # root to: 'articles#index'
  root to: 'posts#index'
  resources :profiles, only: [:show, :edit, :update] do
    resource :follows, only: [:create, :show]
    resource :nofollows, only: [:create]
  end
  resources :images, only: [:update]
  resources :posts do
    resources :comments, only: [:index, :create, :destroy]
    resource :likes, only: [:show, :create, :destroy]
  end
  resources :timelines, only: [:index]
end
